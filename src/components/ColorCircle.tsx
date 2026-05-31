import { Dot } from 'lucide-react';

type ColorInput = {
    color:'green'|'red',
}

export const ColorCircle = ({color='red'}:ColorInput)=>{
    return <div className='flex w-full justify-evenly items-center'>
        <div>Server Status</div>
        <div><Dot color={color} size={56}/></div>
        {color === 'green' ? (
        <div>Server is Alive</div>
        ) : (
        <div>Trying to reconnect</div>
        )}
        </div>
}