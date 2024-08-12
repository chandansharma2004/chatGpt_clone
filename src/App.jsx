
import axios from 'axios';
import './App.css';
import { useState, useEffect } from 'react';
import listen from './assets/images/play.png';




function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  

  async function answerGenerate() {
    setAnswer("Loading...");

    const response = await axios({
  
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA9h6ozef8BcE6v-cbiefksh-pYgJwI18w`,
      method: "post",
      data: {
        contents: [{ parts: [{ text: question }] }],
      },
    });

    setAnswer(response.data.candidates[0].content.parts[0].text);
  }

  const clear = () => {
    setQuestion('');
    setAnswer('');
  }

  const copyToClipboard = () => {
    const targetElement = document.querySelector(".answer");
    const textToCopy = targetElement.textContent.replace(/\s+/g, " ").trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      const copyLabel = document.querySelector(".copy-label");
      const originalText = copyLabel.textContent;
      copyLabel.textContent = "Copied!";
      
      setTimeout(() => {
        copyLabel.textContent = originalText;
      }, 2000); // Revert back to original text after 2 seconds
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

 
const speakText = () => {
  const speech = new SpeechSynthesisUtterance();

  // Get the text content from the element
  const textContent = document.querySelector(".answer").textContent;

  // Remove the specific unwanted symbols (***)
  const sanitizedText = textContent
  // .replace(/\*\*\*/g, '')
  .replace(/[***, **,##,.]/g, '')
  .trim();

  // Set the sanitized text to the speech utterance
  speech.text = sanitizedText;

  // Adjust the rate of speech (e.g., 0.7 is slower than the default rate)
  speech.rate = 0.58;

  // Speak the sanitized text
  window.speechSynthesis.speak(speech);
}

const stopSpeech = () => {
  window.speechSynthesis.cancel();
}

useEffect(() => {
  const listenButton = document.querySelector(".text-listen");
  if (listenButton) {
    listenButton.addEventListener("click", speakText);
  }

  return () => {
    if (listenButton) {
      listenButton.removeEventListener("click", speakText);
    }
  };
}, [answer]);


  return (
    <div className="app-container">
      <h1>Chat AI</h1>
      
      <textarea className="question-input" id='area'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        cols="30"
        rows="10"
        placeholder="Type your question here..."></textarea>
        
      <div>
        <button className="generate-button" onClick={() => { window.location.reload() }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg> Reload
        </button>

        <button className="generate-button" onClick={answerGenerate}>
          Generate Answer
        </button>
    
        <button className="generate-button" onClick={clear}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg> Clear
        </button>

        <div className='contain-button'>
          <button className='text-listen'>
            <img className='img' src={listen} alt="Listen" />
            <span>Listen</span>
          </button>
          <button className='text-stop' onClick={stopSpeech}>
          <svg className='img'xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z"/>
</svg>
            <span>Stop</span>
          </button>
         
        </div>
      </div>

      <div className="answer-display">
        <pre className='answer'>{answer}</pre>
        
        <button className='copy' onClick={copyToClipboard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
          </svg>
          <span className='copy-label'>Copy</span>
        </button>
      </div>
    </div>
  );
}

export default App;

