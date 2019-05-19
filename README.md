# Weather-CLI

Gets weather from openweathermap.org and logs to console.

## Installation

Install asdf and direnv using homebrew:

1. Clone repo
 
    ```sh
    sh ~ ❯❯❯ git clone git@github.com:cyrus-za/weather-cli.git
    ```

1. Open terminal in project directory.
    ```sh
    sh ~ ❯❯❯ cd ./weather-cli
    ```    

1. Create a `.envrc.local` file. 
    ```sh 
    sh ~ ❯❯❯ touch .envrc.local
    ```
    
1. Open `.envrc.local` and add API key from openweathermap.org (sign up if you have not yet) 
    ```text 
    export OPEN_WEATHER_API_KEY=your-key-here-no-quotes
    ```  

1. Install CLI tools:

    ```sh
    sh ~ ❯❯❯ brew install direnv asdf
    ```
    
1. Open new tab or run `cd .` and you will see a message asking you to allow environment variables. Go ahead and type

    ```sh 
    sh ~ ❯❯❯ direnv allow   
    ```
    
1.  install dependencies 

    ```sh 
    sh ~ ❯❯❯ yarn   
    ```

1. If you do not have any errors at this point, you are ready to run your app. If you do have issues, feel free to log a issue on github

## Using Weather-CLI

1. Run `logWeather` command 
    ```sh 
    sh ~ ❯❯❯ yarn logWeather -u <units> -l <location> -l <location2>
    ```

    #### Options
    
   `-u` or `--units` : *Standard, Imperial, Metric* | Optional   
   `-l`, `--location` or `--locations` : *String (City name) or Number (Zip Code)* | Optional
    
   **Important** Strings need to be wrapped in quotes (if it has spaces) which is standard in shell commands.
    
    e.g. `'location name'` 
    
    **NOTE:** If no argument key (`--`) prefixes a string, it will assume that it is a location (for ease of use). 
    
    ##### Examples
    ```sh 
        sh ~ ❯❯❯ yarn logWeather -u Metric -l 'New York' -l Tokyo
    ```
    
    ```sh 
        sh ~ ❯❯❯ ts-node ./src -u Imperial -l 'Cape Town' 'London' 'Sydney'
    ```
    
    ```sh 
        sh ~ ❯❯❯ ts-node ./src 'Cape Town' London --location Sydney
    ```
    
    ```sh 
        sh ~ ❯❯❯ ts-node ./src/index.ts Johannesburg --units metric
    ```

### Testing

Tests were done using *jest*. 

There are unit tests (`src/index.test.ts`, `/src/weather.test.ts`)

There are also integration tests (`src/index.integration.test.ts`)`, which would usually be done with other tools such as Cypress, but this being a CLI and not a website or api, I decided to just stick with jest.

You can run tests with `yarn test`, `yarn test:watch` or `yarn test:coverage` respectively.

### Linting

Linting was added with *eslint* and configured with plugins from *typescript*, *airbnb* and *prettier*.

You can configure it in `.eslintrc` and run it with `yarn lint`

There is also a precommit hook added with *husky* and *lint-staged* to lint all files that are being committed. 

### Contributing

This repository will not be actively maintained but feel free to open up a issue or a pull request at any time and I will take a look.
