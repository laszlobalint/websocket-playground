import io from 'socket.io-client';
import { APP_KEY } from '../utilities/constants';
const socket = io.connect('http://127.0.0.1:8181');
socket.emit('clientAuth', APP_KEY);

export default socket;
