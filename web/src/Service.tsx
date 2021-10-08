import axios from 'axios';

class Service{
    private readonly url = 'http://localhost:8000';

    public async getMeters():Promise<any>{
        const response = await axios.get(this.url+'/meters');
        return response.data;
    }
}


export default Service