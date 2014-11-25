# coding: utf-8
require_relative 'lib/modulejs/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "modulejs-rails"
  spec.version       = Modulejs::Rails::VERSION
  spec.authors       = ["Ales Vilchytski"]
  spec.email         = ["vilchytski.ales@yandex.by"]
  spec.summary       = %q{Lightweight JavaScript module system for Ruby on Rails 4}
  spec.description   = %q{JS module system for Ruby on Rails 4 Assets Pipeline that solves scripts order issues}
  spec.homepage      = "https://github.com/ales-vilchytski/modulejs-rails"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.require_paths = ["lib"]
  
  spec.add_dependency  'railties', '>= 4.0'

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
end
