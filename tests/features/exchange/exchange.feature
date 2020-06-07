Feature: Exchange Test

    Simple trade

    Scenario Outline: Execute Exchange <expiry> <quantity> <action>
        # As User A in the App
        Given the user logs in as 'UserA'
        When the user selects the trade channel with 'UserB'
        And the user selects an RFQ with CF and Future and Account 'UserA'
        And the user selects '<expiry>' and '<quantity>' in the RFQ
        Then the user sends the RFQ
        # As User B in the Browser
        Given the User sets the browser control to Browser
        And the user navigates to the service
        When the user logs in as 'UserB'
        And the user selects the trade channel with 'UserA'
        And the user inputs a quote with '<quantity>' from Account 'UserB'
        Then the user submits the quote
        # As User A in the App
        Given the User sets the browser control to App
        Then the User executes the action '<action>'

        Examples:
            | expiry    | quantity | action |
            | Perpetual | 200000   | Buy    |
            | Perpetual | 200000   | Sell   |
            | 26 Jun 20 | 200000   | Buy    |
            | 26 Jun 20 | 200000   | Sell   |
            | 25 Sep 20 | 200000   | Buy    |
            | 25 Sep 20 | 200000   | Sell   |

