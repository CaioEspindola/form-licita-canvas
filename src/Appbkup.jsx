import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import './App.css'


/*START CONNECTION DATABASE*/
const firebaseApp = initializeApp ({
  apiKey: "AIzaSyA8S-mCR6yq40d37H0QTDcDU2BzyCA4NOI",
  authDomain: "db-form-licita-canvas.firebaseapp.com",
  projectId: "db-form-licita-canvas",
/*   storageBucket: "db-form-licita-canvas.appspot.com",
  messagingSenderId: "30261155083",
  appId: "1:30261155083:web:4951506fe1a834e45d3e0e",
  measurementId: "G-0LGH5HK7WV" */
});
/*END CONNECTION DATABASE*/

export const App = () => {
  const [ nome, setNome ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ telefone, setTelefone ] = useState("")
  const [ entidadegov, setEntidadeGov ] = useState("")
  const [ estado, setEstado ] = useState("")
  const [ cidade, setCidade ] = useState("")

  // eslint-disable-next-line
  const [ users, setUsers ] = useState([])

  const [ msg, setMsg ] = useState("")

  const db = getFirestore(firebaseApp)
  const userCollectionRef = collection(db, 'users')

/*START CREATE USER*/
  async function criarUser() {   

    const camposObrigatoriosValidos = validarCamposObrigatorios();

    if (camposObrigatoriosValidos) {
      try {
        const user = await addDoc(userCollectionRef, {
          nome,
          email,
          telefone,
          entidadegov,
          estado,
          cidade,
        });
        console.log('Usuário criado com sucesso:', user);
        alert('Enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
      }
    } else {
      console.log('Erro ao enviar formulário. Preencha corretamente todos os campos.');
      /* alert('Erro ao enviar formulário. Preencha corretamente todos os campos.'); */
    }
  }
  /*END CREATE USER*/

/*START GET USER*/
/*GET useEffect para que ao carregar a pagina a aplicação acessa o firebase, com a variavel data para listar os dados.*/
/*   useEffect (() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef) */
      /* console.log(data) */
      /*Logica para printar os dados do firestore na tela */
/*       setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    getUsers()
  },[userCollectionRef]); */
/*START GET USER*/

  /*START DELETE*/
  async function deleteUser(id) {
    const userDoc = doc(db, 'users', id)
    await deleteDoc(userDoc);
  }
  /*END DELETE*/

  /*START VALIDATION*/
const validarCamposObrigatorios = () => {
  const camposObrigatorios = ['nome', 'email', 'telefone', 'estado', 'cidade'];

  for (const campo of camposObrigatorios) {
    const inputElement = document.getElementById(campo);
    const valorCampo = inputElement.value;

    // Verifica se o campo está vazio
    if (!valorCampo) {
     /*  alert('Não foi enviado! Preencha todos os campos obrigatórios.'); */
      return false;
    }

    // Verifica se o campo atende às regras de tipo e padrão (pattern)
    if (inputElement.hasAttribute('type') && inputElement.hasAttribute('pattern')) {
      const type = inputElement.getAttribute('type');
      const pattern = new RegExp(inputElement.getAttribute('pattern'));

      if (type === 'text' && !pattern.test(valorCampo)) {
       /*  alert(`Não foi enviado! Preencha corretamente o campo ${campo}.`); */
        return false;
      }     
    }
  }
  // Se todos os campos obrigatórios e suas regras foram atendidos, retorna verdadeiro
  /* alert('Enviado com sucesso!'); */
  return true;
};
/*END VALIDATION*/

/*START DOWNLOAD FUNCTION*/ 
//Função e logica para fazer o download apos preencher o form.
const downloadCanvas = () => {
  // Verifica se todos os campos obrigatórios estão preenchidos
  const camposObrigatoriosPreenchidos = validarCamposObrigatorios();

  if (camposObrigatoriosPreenchidos) {
    
    const arquivoCanvas = '/licita-canvas-download.png';

    // Cria um objeto Blob com a imagem
    fetch(arquivoCanvas)
      .then(response => response.blob())
      .then(blob => {
        // Cria um link temporário para o Blob
        const url = URL.createObjectURL(blob);

        // Cria um link <a> para o Blob e inicia o download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'licita-canvas-download.png';
        document.body.appendChild(link);
        link.click();

        // Libera recursos
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  } else {
    // Se campos obrigatórios não estiverem preenchidos, você pode exibir uma mensagem ou tomar outra ação.
    /* alert('Preencha todos os campos obrigatórios antes de baixar o arquivo.'); */
  }
};
/*END DOWNLOAD FUNCTION*/

/* const handleFormSubmit = (e) => {
  // Verifica se o campo de nome está vazio
  if (nome === "") {
    e.preventDefault(); // Impede o envio do formulário
    setMsg('Cachaça Preencha com seu nome completo');
  } else {
    setMsg(''); // Limpa a mensagem de erro se o nome estiver preenchido
  }
};
 */

console.log("RENDER")

const validaForm = () => {
  const nomeInputElement = document.getElementById('nome');
  const nome = nomeInputElement.value

  const emailInputElement = document.getElementById('email');
  const email = emailInputElement.value

  const telefoneInputElement = document.getElementById('telefone')
  const telefone = telefoneInputElement.value;

  const estadoInputElement = document.getElementById('estado');
  const estado = emailInputElement.value

  const cidadeInputElement = document.getElementById('cidade');
  const cidade = emailInputElement.value
  
  if (nome === "") {
    setMsg('*Preencha com seu nome completo')
    return false
  }
 
  if (!nomeInputElement.checkValidity()) {
    setMsg('*Por favor, Preencha com seu nome completo')
    return false;
  }
  if (email === "") {
    setMsg('*Digite seu email.')
    return false
  }
  if (!emailInputElement.checkValidity()) {
    setMsg('*Digite um email válido e nao se esqueça do @ e .')
    return false;
  }
  if (telefone === "") {  
    setMsg('*Digite seu número de telefone como esta no exemplo')
    return false
  }
  if (!telefoneInputElement.checkValidity()) {
    setMsg('*Digite sem utilizar espaços e com o DDD entre ( )')
    return false;
  }
  if (estado === "") {
    setMsg('*Digite o nome do estado')
    return false    
  }
  if (!estadoInputElement.checkValidity()) {
    setMsg('*Por favor, Preencha com seu nome completo')
    return false;
  }
  if (cidade === "") {
    setMsg('*Digite o nome da cidade')
    return false
  }
  if (!cidadeInputElement.checkValidity()) {
    setMsg('*Por favor, Preencha com seu nome completo')
    return false;
  }
  // Limpar os campos após o envio
    setMsg("")
    setNome("");
    setEmail("");
    setTelefone("");
    setEntidadeGov("");
    setCidade("");
    setEstado("");
  return true  
}
  return (
    <div className="container-form">
      <div className="bg-form">
       <img className="img-logo" src="/logo-licita-canvas-semfundo.png "alt="" />
          <h1 className="title-form">Preencha as informações a seguir e receba o Licita Canvas:</h1>        
          <p>{msg}</p>          
        <form action="" method="">
          <input 
          type="text" 
          placeholder="Nome completo" 
          id="nome" value={nome} 
          onChange={(e) => 
          setNome(e.target.value)}             
          pattern="[a-zA-Z]{3,}" 
          title="*Digite seu nome sem usar números" 
          required/>

          <input type="email" 
          placeholder="email@email.com" 
          id="email" value={email} 
          onChange={(e) => setEmail(e.target.value)}           
          title="Digite seu email" 
          required/>

          <input type="text" 
          placeholder="(67)999636245" 
          id="telefone" 
          value={telefone} 
          onChange={(e) => setTelefone(e.target.value)}            
          pattern="\([0-9]{2}\)[0-9]{9}" 
          title="Digite seu telefone. Apenas números" 
          required/>

          <input type="text" 
          placeholder="Órgão ou entidade governamental" 
          value={entidadegov} 
          onChange={(e) => setEntidadeGov(e.target.value)}/>

          <input    
          type="text" 
          placeholder="Estado" 
          id="estado" 
          value={estado} 
          onChange={(e) => 
          setEstado(e.target.value)} 
          required/>

          <input type="text" 
          placeholder="Cidade" 
          id="cidade" 
          value={cidade} 
          onChange={(e) => setCidade(e.target.value)} 
          required/>

          <button className="button-form" onClick={(e) => { e.preventDefault(); validaForm(); criarUser(); downloadCanvas(); }}>Baixar Canvas</button>
        </form>
        <ul>
          {users.map(user => {
            return (
              <div key={user.id}> 
                <li>{user.nome}</li>
                <li>{user.email}</li>
                <li>{user.telefone}</li>
                <li>{user.entidadegov}</li>
                <li>{user.estado}</li>
                <li>{user.cidade}</li>
                <button onClick={() => deleteUser(user.id)}>Deletar</button>
              </div>
            )
          })}
        </ul>
      </div>
    </div>
  )
};
