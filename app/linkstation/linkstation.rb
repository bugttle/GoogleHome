#!/usr/bin/env ruby

require 'json'
require 'net/ping'
require 'net/http'
require 'nokogiri'
require 'optparse'


class LinkStationClient
  def initialize(host)
    @host = host
  end

  def ping?
    pinger = Net::Ping::HTTP.new(@host, timeout = 0.2)
    return pinger.ping?
  end

  def login(user, password)
    uri = URI.parse('http://%s/cgi-bin/top.cgi' % @host)
    req = Net::HTTP::Post.new(uri.path)
    req.set_form_data({
      'txtAuthLoginUser' => user,
      'txtAuthLoginPassword' => password,
      'hiddenAuthFocus' => '',
      'gPage' => 'top',
      'gMode' => 'auth',
      'txtHelpSearch' => '',
      'gType' => '',
      'gKey' => '',
      'gSSS' => '',
      'gRRR' => '',
      'hiddenDummyText' => 'dummy'
     })

    http = Net::HTTP.new(uri.host, uri.port)
    res = http.request(req)

    # レスポンスをパース
    doc = Nokogiri::HTML(res.body)
    @gSSS = doc.css('#gSSS').first.attribute('value').value
    @gRRR = doc.css('#gRRR').first.attribute('value').value
  end

  def sendShutdown
    uri = URI.parse('http://%s/cgi-bin/top.cgi' % @host)
    req = Net::HTTP::Post.new(uri.path)
    req.set_form_data({
      'txtHelpSearch' => '',
      'gPage' => 'maintenance',
      'gMode' => 'shutdown',
      'gType' => 'shutdown',
      'gKey' => 'undefined',
      'gSSS' => @gSSS,
      'gRRR' => @gRRR,
      'hiddenDummyText' => 'dummy'
    })

    http = Net::HTTP.new(uri.host, uri.port)
    res = http.request(req)
    res
  end
end

def loadJSON(path)
  File.open(path) do |s|
    JSON.load(s)
  end
end

def main
  secret = loadJSON(File.join(File.dirname(__FILE__), '.secret.json'))

  if ARGV.size == 1
    # LinkStationへのリクエスト
    client = LinkStationClient.new(secret['host'])

    case ARGV[0]
      when 'on' then
        # リモートで電源を入れられないので何もしない
        puts '[ON] do nothing.'
      when 'off' then
        if client.ping?
          # 起動していればシャットダウンのリクエスト
          puts 'waiting for shutdown response...'
          client.login(secret['user'], secret['password'])
          client.sendShutdown
        else
          # 起動していないので何もしない
          puts '[OFF] do nothing when turned off.'
        end
      when 'state' then
        # 電源が入っているかのチェック
        state = client.ping?
        puts '[STATE] %s' % (state ? 'on' : 'off')
        exit state
    end
  end
end


if __FILE__ == $0
  main
end
