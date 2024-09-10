import { makeAutoObservable } from 'mobx';

class MqttStore {

    mqttClient = '';

    constructor() {
        makeAutoObservable(this);
    }

    setMqttClient(status) {
        console.log('mqttClient: ', status);
        this.mqttClient = status;
    }
}

const mqttStore = new MqttStore();
export default mqttStore;