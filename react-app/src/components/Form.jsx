import { useState } from 'react';
import "./Form.css";
import Preview from './Preview';

function Form() {

    const [ linksInfo, setLinksInfo ] = useState();
    const [ message, setMessage ] = useState();

    async function handleSubmit(){
        var submitB = document.querySelector('.Form-content > button');
        setMessage();
        setLinksInfo();
        submitB.innerText = "";
        submitB.innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-sm"></i>';
        var textArea = document.querySelector('.Form-content > textarea').value;
        if(textArea){
            try{
                var response = await fetch('http://localhost:5001/web-scraping99/us-central1/scraper', {
                    method: 'POST',
                    body: JSON.stringify({ text : textArea })
                });
                var data = await response.json();
    
                data.message ? setMessage(data.message) : setLinksInfo(data);
                console.log(data);
                submitB.innerHTML = '';
                submitB.innerText = "Submit";
            } catch(e) {
                console.log('Message', e.message);
            }
        }
    }

    return (
    <>
        <div className="Form-container">
            <h2>Explore Links</h2>
            {
                message && (
                    <div className="Form-error">
                        { message }
                    </div>
                )
            }
            <div className="Form-content">
                <textarea spellCheck="false" autoComplete="false" placeholder="Place your urls here!" />
                <button onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
        {

            linksInfo && (
                <div className="Previews-holder">
                    {
                        linksInfo.map((link, idx) => (
                            <Preview key={idx} link={link} />
                        ))
                    }
                </div>
            )
        }
    </>
    );
}

export default Form;