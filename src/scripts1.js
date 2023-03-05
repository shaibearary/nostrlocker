import { nip19, getBlankEvent, SimplePool } from "nostr-tools";

const defaultRelays =
  ["wss://relay.damus.io",
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-verified.wellorder.net",
    "wss://expensive-relay.fiatjaf.com",
    "wss://nostr-relay.wlvs.space"]


const pool = new SimplePool();
let state = null;

window.addEventListener("load", async () => {
  console.log('a')
  if (!window.nostr) {
    alert("You need a NIP-07 browser extension (Alby, nos2x) to use this tool!");
    return;
  }

  const nostr = window.nostr;
  const pubkey = await nostr.getPublicKey();
  startPool(pubkey)
  const relaysObj = new Map()
  const form = document.getElementById("form");
  restore()
  async function submitRelays() {
    console.log('sss')
    const event = getBlankEvent();
    var inputAreas = Array.from(document.getElementsByClassName("input-relay-area"));
    inputAreas.forEach(async function (inputArea) {
      relaysObj[inputArea.value] = { read: true, write: true };
    })
    event.kind = 3;
    event.pubkey = await nostr.getPublicKey();
    event.content = JSON.stringify(relaysObj);
    event.created_at = Math.floor(Date.now() / 1000);
    try {

      event.tags = JSON.parse(localStorage.getItem('kind3Event')).tags
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    storedEvent = JSON.stringify(event);
    localStorage.setItem('kind3Event', storedEvent);


    try {
      const signed = await nostr.signEvent(event);
      let pubs = pool.publish(defaultRelays, signed)
      pubs.on('ok', (status, url) => {
        if (status === 0) {
          console.log(`publish request sent to ${url}`);
        }
        if (status === 1) {
          console.log(`event published by ${url}`, ev);
        }

      })

      form.reset();
    } catch (error) {
      console.error(error);
    }
    location.reload()

  }
  // 


  // Get the values of the form elements
  // var nameVal = myForm["name"].value;
  // var emailVal = myForm["email"].value;
  // var messageVal = myForm["message"].value;

  // // Display the values in an alert box
  // alert("Name: " + nameVal + "\nEmail: " + emailVal + "\nMessage: " + messageVal);

  async function submitnprofile() {
    console.log("1")
    nprofile = document.getElementById("input-nprofile-area").value
    let { type, data } = nip19.decode(nprofile)
    if (type === 'nprofile') {
      relays = data.relays
    }
    console.log("2")
    const event = getBlankEvent();
    relays.forEach(async function (relay) {
      relaysObj[relay] = { read: true, write: true };
    })
    event.kind = 3;
    event.pubkey = await nostr.getPublicKey();
    event.content = JSON.stringify(relaysObj);
    event.created_at = Math.floor(Date.now() / 1000);
    try {

      event.tags = JSON.parse(localStorage.getItem('kind3Event')).tags
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    storedEvent = JSON.stringify(event);
    localStorage.setItem('kind3Event', storedEvent);


    try {
      const signed = await nostr.signEvent(event);
      let pubs = pool.publish(defaultRelays, signed)
      pubs.on('ok', (status, url) => {
        if (status === 0) {
          console.log(`publish request sent to ${url}`);
        }
        if (status === 1) {
          console.log(`event published by ${url}`, ev);
        }
        // this may be called multiple times, once for every relay that accepts the event
        // ...
      })
      form.reset();
    } catch (error) {
      console.error(error);
    }
    location.reload()

  }
  const subnprofile = document.getElementById("submit-nprofile-button");
  const addButton = document.getElementById("add-button");
  const submitButton = document.getElementById("submit-relay-button");

  addButton.addEventListener("click", addInput);
  submitButton.addEventListener("click", submitRelays);
  subnprofile.addEventListener("click", submitnprofile);


});
async function restore() {
  kind3Event = JSON.parse(localStorage.getItem('kind3Event'))
  if (kind3Event != null) {
    
    populateRelays(kind3Event)
   
  }
}
export default async function startPool(pubkey) {
  const userRelays = await nostr?.getRelays?.() || [];
  const relays = defaultRelays;
  let sub = pool.sub(
    defaultRelays,
    [
      { authors: [pubkey], kinds: [0] }
    ]
  )
  for (const key in userRelays) {
    relays.set(key, userRelays[key]);
  }
  relays.forEach((policy, url) => {
    // pool.addRelay(url, policy);
  });
  console.log(`fetch metadata from ${pubkey}`);

}
function populateRelays(event, relay) {
  if (state && state.created_at > event.created_at) return;
  state = {
    created_at: event.created_at,
    content: JSON.parse(event.content)
  };
  if (state.content.length == 1) {
    document.getElementsByClassName("input-relay-area")[0].value = Object.keys(state.content)[0]
  }
  else {
    document.getElementsByClassName("input-relay-area")[0].value = Object.keys(state.content)[0]
    const keys = Object.keys(state.content);
    for (let i = 1; i < keys.length; i++) {
      addInput()
      document.getElementsByClassName("input-relay-area")[i].value = Object.keys(state.content)[i]
    }
  }


  async function startPool(pubkey) {
    const userRelays = await nostr?.getRelays?.() || [];
    const relays = defaultRelays;
    for (const key in userRelays) {
      relays.set(key, userRelays[key]);
    }
    relays.forEach((policy, url) => {
      pool.addRelay(url, policy);
    });
    console.log(`fetch metadata from ${pubkey}`);
    pool.sub({ cb: populateInputs, filter: { authors: [pubkey], kinds: [0] } });
  }
}




/*
{
    "id": <32-bytes sha256 of the the serialized event data>
    "pubkey": <32-bytes hex-encoded public key of the event creator>,
    "created_at": <unix timestamp in seconds>,
    "kind": <integer>,
    "tags": [
      ["e", <32-bytes hex of the id of another event>, <recommended relay URL>],
      ["p", <32-bytes hex of the key>, <recommended relay URL>],
      ... // other kinds of tags may be included later
    ],
    "content": <arbitrary string>,
    "sig": <64-bytes signature of the sha256 hash of the serialized event data, which is the same as the "id" field>
  }
  */
const inputContainer = document.getElementById("input-container");


const subnprofile = document.getElementById("submit-nprofile-button");
const addButton = document.getElementById("add-button");
const submitButton = document.getElementById("submit-relay-button");



function addInput() {
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  const inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("input-relay-area");

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", () => {
    inputGroup.remove();
  });

  inputGroup.appendChild(inputArea);
  inputGroup.appendChild(deleteButton);
  inputContainer.appendChild(inputGroup);
}


