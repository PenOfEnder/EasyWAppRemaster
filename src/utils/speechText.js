export default function textToVoice(text, lang){
    if(window.speechSynthesis.speaking){
        window.speechSynthesis.cancel();
    }
    else{
        const receivedText = text;
        const receivedLang = lang;
        
        const utterance = new SpeechSynthesisUtterance(receivedText);
        utterance.rate = 0.9;
        utterance.lang = receivedLang;
           
        window.speechSynthesis.speak(utterance)
    }
}