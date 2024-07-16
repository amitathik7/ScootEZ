import React, { useEffect, useState } from 'react';
import styles from '../styles.css';

export default function HomePage() {
    return (
        <div>
            <div className="greenStripe"/>
            <div className="midGreenStripe"/>
            <div style={{width: "100%", height: "400px"}}>
                <img src={require("../assets/scooterPhoto1.jpg")} alt="photo of scooters"
                    style={{float: "right", width: "60%", height: "400px", objectFit: "cover"}}/>
                <div style={{position: "absolute", top: "140px", left: "0px", zIndex: "0"}}>
                    <svg height="400px" width="800px" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,0 650,0 800,400 0,400" fill="#38611b" />
                    </svg>
                </div>
                <div style={{position: "absolute", top: "210px", left: "120px", zIndex: "2",
                    fontFace: "Roboto", fontWeight: "500", color: "white", fontSize: "30px"}}>
                    <h1 className="homePage">RIDE</h1>
                    <h1 className="homePage">WITH</h1>
                    <h1 className="homePage">EASE</h1>
                </div>
            </div>
            <div className="emptyStripe"/>
            <div className="greenStripe"/>
            <div className="midGreenStripe"/>
            <div style={{width: "100%", height: "400px", background: "red"}}>
                <img src={require("../assets/ReitzUnionPhoto.png")} alt="photo of the Reitz Union"
                    style={{float: "left", width: "60%", height: "400px", objectFit: "cover"}}/>
                <div style={{position: "absolute", top: "620px", left: "719px", zIndex: "0"}}>
                    <svg height="400px" width="800px" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,0 800,0 800,400 150,400" fill="#38611b"/>
                    </svg>
                </div>
            </div>
            <div style={{position: "absolute", top: "690px", left: "1000px", zIndex: "2",
                fontFace: "Roboto", fontWeight: "500", color: "white", fontSize: "30px", textAlign: "right"}}>
                <h1 className="homePage">LOCATIONS</h1>
                <h1 className="homePage">AROUND</h1>
                <h1 className="homePage">GAINESVILLE</h1>
            </div> 
            <div className="emptyStripe"/>
        </div>
    );
}