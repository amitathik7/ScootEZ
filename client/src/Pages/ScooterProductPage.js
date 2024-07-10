import React from 'react';
import { useParams } from 'react-router-dom';

export default function ScooterPage() {
    const { id } = useParams();
    return(
        <div>
            This is a page for scooter {id}
        </div>
    );
}