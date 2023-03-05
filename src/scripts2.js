import {getBlankEvent, SimplePool} from "nostr-tools";
import { addRow, deleteRow, getValue } from './utils.js';
document.getElementById("getValueButton").addEventListener("click", getValue);
document.getElementById("addRowButton").addEventListener("click", addRow);
const defaultRelays = 
  ["wss://relay.damus.io", 
  "wss://nostr-pub.wellorder.net", 
  "wss://nostr-verified.wellorder.net",
  "wss://expensive-relay.fiatjaf.com", 
  "wss://nostr-relay.wlvs.space"]
const kind3Event = JSON.parse(localStorage.getItem('kind3Event'))
const pool =new SimplePool();
let state = null;

window.addEventListener("load", async () => {
  console.log("a")
  if (!window.nostr) {
    alert("You need a NIP-07 browser extension (Alby, nos2x) to use this tool!");
    return;
  }

  const nostr = window.nostr;
  const pubkey = await nostr.getPublicKey();
  startPool(pubkey)
  console.log('wtf1')

  restore()
  async function submitContacts(){
    const event = getBlankEvent();
    var inputAreas = Array.from( document.getElementsByClassName("input-contact-area"));
    const tags = [];
    for (let i = 0; i < inputAreas.length; i++) {
      const innerArr = ['p', inputAreas[i].value];
      tags.push(innerArr);
    }

    event.kind = 3;
    event.pubkey =  await nostr.getPublicKey();
    event.tags = tags
    event.created_at = Math.floor(Date.now() / 1000);
    try {

      event.content = kind3Event.content;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    let storedEvent = JSON.stringify(event);
    localStorage.setItem('kind3Event', storedEvent);


    try {
      const signed =  await nostr.signEvent(event);
      let pubs = pool.publish(defaultRelays, signed)
      pubs.on('ok', () => {
        console.log(`has accepted our event`)
      })
      pubs.on('failed', reason => {
        console.log(`failed to publish to : ${reason}`)
      })
      form.reset();
    } catch (error) {
      console.error(error);
    }
    // location.reload()
  }

  addButton.addEventListener("click", addInput);
  submitButton.addEventListener("click", submitContacts);
  

});
async function restore() {

  let kind3Event = JSON.parse(localStorage.getItem('kind3Event'))
  if (kind3Event!=null){
    console.log('wtf3')
    populateContacts(kind3Event)
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
function populateContacts(event, relay) {
  if (state && state.created_at > event.created_at) return;
  state = {
    created_at: event.created_at,
    tags: event.tags
  };
  let contacts = state.tags.map(innerArr => innerArr[1]);

  if (state.tags.length==1){
    document.getElementsByClassName("input-contact-area")[0].value = contacts[0]
  }
  else{
    document.getElementsByClassName("input-contact-area")[0].value = contacts[0]
    // const keys = Object.keys(state.content);
    for (let i = 1; i < contacts.length; i++) {
      addInput()
      document.getElementsByClassName("input-contact-area")[i].value = contacts[i]
    }
}
  // }
  // Array.from( document.getElementsByClassName("input-relay-area"))
  // document.getElementById("name").value = state.content.name || "";
  // document.getElementById("nip05").value = state.content.nip05 || "";
  // document.getElementById("lud06").value = state.content.lud06 || "";
  // document.getElementById("about").value = state.content.about || "";
  // document.getElementById("picture").value = state.content.picture || "";

  // if (state.content.picture) {
  //   let figure = document.getElementById("image-display");
  //   if (figure.hasChildNodes()) {
  //     figure.removeChild(figure.firstElementChild);
  //   }
  //   let img = document.createElement("img");
  //   img.src = state.content.picture;
  //   figure.appendChild(img);
  // }
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
  const addButton = document.getElementById("add-button");
  const submitButton = document.getElementById("submit-contact-button");
  
  function addInput() {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");
  
    const inputArea = document.createElement("input");
    inputArea.type = "text";
    inputArea.classList.add("input-contact-area");
  
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

 

  // let content = {};
  // data.name.length ? (content.name = data.name) : null;
  // data.about.length ? (content.about = data.about) : null;
  // data.picture.length && isImage(data.picture)
  //   ? (content.picture = data.picture)
  //   : null;
  // data.nip05.length ? (content.nip05 = data.nip05) : null;
  // data.lud06.length ? (content.lud06 = data.lud06) : null;
 // const event = getBlankEvent();
  // event.kind = 0;
  // event.pubkey = await nostr.getPublicKey();
  // event.content = JSON.stringify(content);
  // event.created_at = Math.floor(Date.now() / 1000);
  // console.log(event);
  // storedEvent = JSON.stringify(event);
  // localStorage.setItem('metadata', storedEvent);
  // try {
  //   const signed = await nostr.signEvent(event);

  //   const ev = await pool.publish(signed, (status, url) => {
  //     if (status === 0) {
  //       console.log(`publish request sent to ${url}`);
  //     }
  //     if (status === 1) {
  //       console.log(`event published by ${url}`, ev);
  //     }
  //   });
  //   form.reset();
  // } catch (error) {
  //   console.error(error);
  // }
  