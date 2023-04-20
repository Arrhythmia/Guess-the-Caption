
export let myself = {clientId: '', playerName: ''};

export function setClientId(id: string){
    myself.clientId = id;
}

export function setPlayerName(username: string){
    myself.playerName = username;
}