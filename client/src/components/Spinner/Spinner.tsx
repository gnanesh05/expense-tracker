import './Spinner.css'
import loader from '../../assets/Fading line.gif'

function Spinner({loading}:{loading:boolean}) {
  return (
    <div className={`spinner ${loading ? 'loading':''}`}>
        <img className='loader' src={loader} alt='loading'/>
    </div>
  )
}

export default Spinner