base-auth-sdk
=============

How to add "Continue with Bitclave" widget?
-------------------------------------------

1. Generate keypair
2. Register your site's URL in the BASE Node using the public key
3. Add widget

        <div id="base-login"></div>
        <script src="https://base-auth-sdk-prod.herokuapp.com/BASEAuthSDK.js"></script>
        <script>
        window.addEventListener("load", function () {
            const widget = new BASEAuthSDK.Widget({
                verificationMessage: 'unguessable random message',
            });

            widget.insertLoginButton("#base-login");
        });
        </script>


Widget methods
--------------

- `widget.listenForLogin(callback)`: Listen for login events

        widget.listenForLogin(account => {
            alert("User has logged in! Public key: " + account.publicKey);
        });


- `widget.listenForLogout(callback)`. Listen for logout events

        widget.listenForLogout(() => {
            alert("User has logged out!");
        });

- `widget.requestPermissions([BASEAuthSDK.UserPermissions.EMAIL, ...])`: Request a list of permissions from user

        widget.requestPermissions([
            BASEAuthSDK.UserPermissions.EMAIL,
        ]).then(acceptedPermissions => {
            alert('Accepted permissions: ' + JSON.stringify(acceptedPermissions));
        });

- `widget.openDashboard()`: Open user's BASE dashboard in a new tab


BASE Node methods
-----------------

- `widget.baseNodeAPI.getAllOffers()`: Request the list of offers for the user

        widget.baseNodeAPI.getAllOffers().then(response => {
            alert("All offers: " + JSON.stringify([...response]));
        )};

- `widget.baseNodeAPI.getData()`: Request user's data from the BASE Node

        widget.baseNodeAPI.getData().then(response => {
            alert("Data: " + JSON.stringify([...response]));
        });

- `widget.baseNodeAPI.updateData({ key: "value" })`: Update user's data


How to debug locally?
-------------------------------------------
- build for development: NODE_ENV=development npm run build
- run locally: cd dist lite-server .
-- assumes base-auth-frontened is running on localhost:4200
-- starts base-auth-sdk on port 3000. You need to point your application to http://localhost:3000/BASEAuthSDK.js
