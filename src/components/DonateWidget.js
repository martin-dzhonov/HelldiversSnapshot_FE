import { useEffect } from "react";
import '../styles/App.css';
import useMobile from "../hooks/useMobile";

function DonateWidget() {
	const { isMobile } = useMobile()
    useEffect(() => {
		const script = document.createElement("script");
		const div = document.getElementById("supportByBMC");
		script.setAttribute("data-name", "BMC-Widget");
		script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
		script.setAttribute("data-id", "helldive.live");
		script.setAttribute("data-description", "Support me on Buy me a coffee!");
		// script.setAttribute(
		// 	"data-message",
		// 	"Servers ain't cheap, you know ✨",
		// );
		script.setAttribute("data-color", "#FFDD00");
		script.setAttribute("data-position", "Right");
		script.setAttribute("data-x_margin", isMobile ? '10' : '40');
		script.setAttribute("data-y_margin", isMobile ? '10' : '40');
		script.async = true;
		document.head.appendChild(script);
		script.onload = function () {
			var evt = document.createEvent("Event");
			evt.initEvent("DOMContentLoaded", false, false);
			window.dispatchEvent(evt);
		};

		div.appendChild(script);
	}, []);

	return <div id="supportByBMC"></div>;
}

export default DonateWidget;
