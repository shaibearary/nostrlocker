import { getBlankEvent, SimplePool } from "nostr-tools";
let  defaultRelays =
  ["wss://relay.damus.io","wss://nostr-pub.wellorder.net",
    "wss://nostr-verified.wellorder.net",
    "wss://expensive-relay.fiatjaf.com",
    "wss://nostr-relay.wlvs.space",
    "wss://brb.io"]

const pool = new SimplePool();
let state = null;
// relayList = null

window.addEventListener("load", async () => {
  console.log("a")
  if (!window.nostr) {
    alert("You need a NIP-07 browser extension (Alby, nos2x) to use this tool!");
    return;
  }

  const nostr = window.nostr;
  const pubkey = await nostr.getPublicKey();

  // await startPool(pubkey);
  await restore(pubkey)
  console.log(state);
  const form = document.getElementById("form");
  const sendBtn = document.getElementById("send-event");
  sendBtn.addEventListener("click", logKey, false);
  console.log("a")
  document.getElementById("picture").addEventListener("change", (ev) => {
    let src = ev.target.value;
    let image = document.getElementById("image-display").firstElementChild;
    if (!isImage(src)) {
      image.style.display = "none";
      document.getElementById("image-display").ariaBusy = true;
      return;
    }
    image.style.display = "block";
    document.getElementById("image-display").ariaBusy = false;
    image.src = src;
  });

  async function logKey() {
    const data = Object.fromEntries(new FormData(form));

    const event = getBlankEvent();

    let content = {};
    data.name.length ? (content.name = data.name) : null;
    data.about.length ? (content.about = data.about) : null;
    data.picture.length && isImage(data.picture)
      ? (content.picture = data.picture)
      : null;
    data.nip05.length ? (content.nip05 = data.nip05) : null;
    data.lud06.length ? (content.lud06 = data.lud06) : null;

    event.kind = 0;
    event.pubkey = await nostr.getPublicKey();
    event.content = JSON.stringify(content);
    event.created_at = Math.floor(Date.now() / 1000);
    console.log(event);
    let storedEvent = JSON.stringify(event);
    localStorage.setItem('metadata', storedEvent);
    try {
      const signed = await nostr.signEvent(event);

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
  }
});
async function restore(pubkey) {
  let metadata = JSON.parse(localStorage.getItem('metadata'))
  if (localStorage.getItem('metadata') != null) {
    console.log()
    populateInputs(metadata)
  }
  startPool(pubkey)


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
  // for (const key in userRelays) {
  //   relays.set(key, userRelays[key]);
  // }
  relays.forEach((policy, url) => {
    // pool.addRelay(url, policy);
  });
  console.log(`fetch metadata from ${pubkey}`);

}

function populateInputs(event, relay) {
  if (state && state.created_at > event.created_at) return;
  state = {
    created_at: event.created_at,
    content: JSON.parse(event.content)
  };
  document.getElementById("name").value = state.content.name || "";
  document.getElementById("nip05").value = state.content.nip05 || "";
  document.getElementById("lud06").value = state.content.lud06 || "";
  document.getElementById("about").value = state.content.about || "";
  document.getElementById("picture").value = state.content.picture || "";

  if (state.content.picture) {
    let figure = document.getElementById("image-display");
    if (figure.hasChildNodes()) {
      figure.removeChild(figure.firstElementChild);
    }
    let img = document.createElement("img");
    img.src = state.content.picture;
    figure.appendChild(img);
  }
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
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
const submitButton = document.getElementById("submit-relay-button");

function addInput() {
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  const inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.classList.add("input-area");

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


function submitRelays() {
  var myForm = document.getElementsByClassName("input-area");
  console.log(myForm[1].value)

  // Get the values of the form elements
  // var nameVal = myForm["name"].value;
  // var emailVal = myForm["email"].value;
  // var messageVal = myForm["message"].value;

  // // Display the values in an alert box
  // alert("Name: " + nameVal + "\nEmail: " + emailVal + "\nMessage: " + messageVal);

}
addButton.addEventListener("click", addInput);
submitButton.addEventListener("click", submitRelays);
