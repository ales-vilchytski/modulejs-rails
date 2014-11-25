# modulejs for Ruby on Rails 4 Assets Pipeline

Lightweight JavaScript module system (http://larsjung.de/modulejs/).
Inspired by article: https://www.reinteractive.net/posts/172-a-better-way-to-modularise-your-js-in-rails

When you want to use modules in JavaScript you should solve next problems:

1. Load scripts with dependencies, usually in big concatenated JavaScript file
2. Execute scripts and dependencies in proper order

Rails solves problem 1 by Assets Pipeline, modulejs solves problem 2.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'modulejs-rails'
```

And then execute:

    $ bundle install

Or install it yourself as:

    $ gem install modulejs-rails

## Usage

Require in Assets Pipeline manifest

    //= require 'modulejs'

## Contributing

1. Fork it ( https://github.com/ales-vilchytski/modulejs-rails/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
