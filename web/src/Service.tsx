import axios from 'axios';
import { Measurement } from './data';

class Service{
    private readonly url = 'http://localhost:8000';

    public async getMeters():Promise<any>{
        const response = await axios.get(this.url+'/meters');
        return response.data;
    }

    public async getMeterMeasurements(meterID:number):Promise<Measurement[]>
    {
        const response = await axios.get(this.url+'/meters/'+meterID+'/measurements');
        return response.data;
    }
}


export default Service