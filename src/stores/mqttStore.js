import { makeAutoObservable } from 'mobx';

class MqttStore {

    mqttClient = '';

    constructor() {
        makeAutoObservable(this);
    }

    setMqttClient(status) {
        this.mqttClient = status;
    }
}

const mqttStore = new MqttStore();
export default mqttStore;