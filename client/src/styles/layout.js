import React from "react"
import "./layout.css"

export default function Layout({ children }) {
    return(
        <div>
            @import url('https://fonts.googleapis.com/css?family=Roboto');
            {children}
        </div>
    )
}