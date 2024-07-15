import React from 'react';

export default function FaqPage() {
    return(
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>FAQs</h1>
                <h2>How can I rent a scooter?</h2>
                <p>
                    Renting is super easy online! Go to the ScootEZ website and click the green "LOGIN" button on the top right.
                    You can log into your account there, or if you don't have one, you can click the "CREATE ACCOUNT" button
                    to make your account for free!
                </p>
                <p>
                    Once logged in, go to "RENT" and see the selection of scooters available. You can rent any of them by clicking
                    on them and pressing their "RENT" button. Fill out the rental form with details like time and payment (if
                    you don't have one already connected to your account), and you're good to go.
                </p><br/>
                <h2>Do I need to have an account to rent a scooter?</h2>
                <p>
                    Yes. You can make one now for free!
                </p><br/>
                <h2>Do I have to return the scooter to the same location I rented it from?</h2>
                <p>
                    No, simply return it to any of our locations around UF.
                </p><br/>
            </div>
        </div>
    );
}