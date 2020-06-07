# Introduction

This is a pet project for getting spectron and a normal browser to work together. Spectron uses WDIO underneath and requires a specific version of electron to run.
This means, we're tied to a specific WDIO version, and in order to optimize our code we're going to play by these constraints.
This project assumes a spectron version of 6.0, which matches Chrome 69. This also means that we're bound to WDIO 4.x which is deprecated as of now (and therefore more fun!).
We need to install electron as a devDependency, and the old version of WDIO has a bug where when not using the runner, we need to launch and kill ChromeDriver ourselves (fun x2 :)).

## Actions that could simplify / improve this code

-   Update the app's electron version, that should bring us within a supported wdio range (v5+) and fix a **lot** of bugs and hacks :)
-   This project includes a sample on how page objects should be implemented and would look like. Improve upon these and create a full PO/FO structure.
-   Improve the selectors used as right now there's no testid's present
-   The page used for this project has a bug by which it will reload itself if the browser has no cache (only occurs in Browsers)
-   Likely, due to the version of spectron/chromedriver, there will be a couple of conhost.exe displayed when running the tests on Windows. This should be solved when upgrading to a newer version.

## How to run

Install all the modules using `yarn` and then create a .env defining:

-   **URL** The URL to use as target practice
-   **USER_LIST** A magical user list that will allow you to login to our target URL
-   **APP_PATH** The path to our electron app

Once the above has been setup, you can run `yarn test` and enjoy :tada:!
