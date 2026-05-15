//DECLARAÇÕES DOS ELEMENTOS COM DOM
const videoElemento=document.getElementById("video");
const botaoScanear=document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//função para habilitar a câmera

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment"}, //habilitando a camera traseira
            audio:false // o audio não será capturado
        })
        //atribuir o fluxo da camera em midia
        videoElemento.srcObject = midia;
        //Garante que a câmera vai funcionar
        videoElemento.play();
    }catch(erro){
            resultado.innerText="Erro ao capturar a câmera",erro
    }
}
//executa função da câmera
configurarCamera();

//função para capturar o texto

botaoScanear.onclick = async ()=>{
    botaoScanear.disabled =true;// habilita o botão para pegar o texto
    resultado.innerText ="Fazendo a Leitura ...aguarde";

    //prepara o canvas para receber a estrutura em 2d
    const contexto = canvas.getContext("2d");

    //ajusta o tamnho do canvas de acordo com video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //define a matriz de transformação do canvas (escla, inclinação)
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    //aplica fitro de contrast para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    //Desenha p video no canvas
    contexto.drawImage(videoElemento, 0, 0, canvas.width,canvas.height);

    try{
        //o tesseract retorna o objeto
        const {data: { text }}= await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        );
        //remove todos os espaços em branco
        const textoFinal= text.trim();
        resultado.innerText=textoFinal.length > 0 ? textoFinal :"Não foi possivel identificar o texto";
    }catch(erro){
        resultado.innerText="Erro ao processar a leitura",erro
    }finally{
        //desabilita a leitura do texto para começar novamente.
        botaoScanear.disabled=false;
    }
}