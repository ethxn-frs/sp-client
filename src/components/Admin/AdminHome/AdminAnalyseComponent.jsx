import { Doughnut,Line, Bar} from 'react-chartjs-2';

const data = {
    labels: ['red','Blue','Orange','Yellow'],
    datasets: [
        {
            labels: " couleur des vote",
            data: ['23','34','12','15'],
            backgroundColor:['red','Blue','Orange','Yellow']
        }
    ]
}

function AdminAnalyseComponent(){
    return(
        <div className='projet-analyse'>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={data} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={data}/>
                </div>
            </div>

            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={data} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={data}/>
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={data} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={data}/>
                </div>
            </div>
            {/** 
            <Doughnut data={data} />
            <Line data={data} />
            <Bar data={data}/>*/}
        </div>
    );
}

export default AdminAnalyseComponent;