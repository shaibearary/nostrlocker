# nostrlocker

This is an extension of https://github.com/talvasconcelos/metanostr

Problem:
People suffer from losing their contacts so I develop this mico-app for user easily find out their backup if their data is modified by other app.
eg: Losting all their contacts

Solution:
People manage their own data via a micro web app and store them locally. 
When it is modified by other app, you can always go back here to restore.

You can try it at https://nostr-manager.netlify.app/

TODO

- [ ] Add relay support to so people will know/can control where their meta data/relay/contacts list will be posted to
- [ ] Add result feed back so they will know the result of post
- [ ] Problem: Input over 50+ contact by pubkey is imposstble
      solution: support fetch contact list from a relay
- [ ] Problem: people are more used to npub
      solution: add npub support
