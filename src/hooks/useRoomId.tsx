import { useState, useEffect, SetStateAction } from 'react';

export const useRoomId = (props: { data: SetStateAction<string | null>; }) => {
    const [roomId, setRoomID] = useState<string | null>(null);
    setRoomID(props.data);

    useEffect(() => {
        console.log('Use Room ID Navigate');
    }, [setRoomID]);
}
