import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate();

    // navigate home after 1 second
    useEffect(() => {
        setTimeout(() => {
            navigate("/"); // navigates home
        }, 2000)
    }, []);

    return (
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Oops!</h1>
                <h2>This page does not exist!</h2>
                <p>
                    Taking you back...
                </p>
            </div>
        </div>
    );
}