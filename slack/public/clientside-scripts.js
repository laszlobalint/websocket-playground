const username = prompt('What is your username?');
const socket = io('http://localhost:9000', {
  query: {
    username,
    avatar: 'https://source.unsplash.com/random/30x30',
  },
});
let nsSocket = '';

socket.on('nsList', (nsData) => {
  const namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.image}" /></div>`;
  });

  Array.from(document.getElementsByClassName('namespace')).forEach((e) => {
    e.addEventListener('click', (event) => {
      const nsEndpoint = e.getAttribute('ns');
      joinNs(nsEndpoint);
    });
  });
});
