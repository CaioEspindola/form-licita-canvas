import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import './App.css'

//Start Function downloadCanvas. Função e logica para fazer o download apos preencher o form.
const downloadCanvas = () => {
  // Verifica se todos os campos obrigatórios estão preenchidos
  const camposObrigatoriosPreenchidos = validarCamposObrigatorios();

  if (camposObrigatoriosPreenchidos) {
    // Substitua 'licita-canvas-download.png' pelo nome real do seu arquivo
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

const validarCamposObrigatorios = () => {
  
  const camposObrigatorios = ['nome', 'email', 'telefone', 'cidade', 'estado'];

  for (const campo of camposObrigatorios) {
    const valorCampo = document.getElementById(campo).value;

    // Se algum campo obrigatório estiver vazio, retorna falso
    if (!valorCampo) {
      return false;
    }
  }
  // Se todos os campos obrigatórios estiverem preenchidos, retorna verdadeiro
  return true;
};

//End Function downloadCanvas

const firebaseApp = initializeApp ({
  apiKey: "AIzaSyA8S-mCR6yq40d37H0QTDcDU2BzyCA4NOI",
  authDomain: "db-form-licita-canvas.firebaseapp.com",
  projectId: "db-form-licita-canvas",
/*   storageBucket: "db-form-licita-canvas.appspot.com",
  messagingSenderId: "30261155083",
  appId: "1:30261155083:web:4951506fe1a834e45d3e0e",
  measurementId: "G-0LGH5HK7WV" */
});

export const App = () => {
  const [ nome, setNome ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ telefone, setTelefone ] = useState("")
  const [ entidadegov, setEntidadeGov ] = useState("")
  const [ cidade, setCidade ] = useState("")
  const [ estado, setEstado ] = useState("")

  // eslint-disable-next-line
  const [ users, setUsers ] = useState([])

  const db = getFirestore(firebaseApp)
  const userCollectionRef = collection(db, 'users')

  async function criarUser() {
   const user = await addDoc(userCollectionRef, {
     nome, 
     email, 
     telefone, 
     entidadegov, 
     cidade, 
     estado,
    })
    console.log(user)
  }
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


  /*Delete*/

  async function deleteUser(id) {
    const userDoc = doc(db, 'users', id)
    await deleteDoc(userDoc);
  }

  return (
    <div className="container-form">
      <div className="bg-form">
       <img className="img-logo" src="/logo-licita-canvas-semfundo.png "alt="" />
        <h1 className="title-form">Preencha as informações a seguir e receba o Licita Canvas:</h1>
        <form action="" method="">
          <input type="text" placeholder="Nome completo" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} pattern="[a-zA-Z]{3,}" title="Digite seu nome sem usar números" required/>
          <input type="email" placeholder="email@email.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} title="Digite seu email" required/>
          <input type="text" placeholder="(67)999636245" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)}  pattern="\([0-9]{2}\)[0-9]{4}[0-9]{4}" title="Digite seu telefone. Apenas números" required/>
          <input type="text" placeholder="Órgão ou entidade governamental" value={entidadegov} onChange={(e) => setEntidadeGov(e.target.value)}/>
          <input type="text" placeholder="Cidade" id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required/>
          <input type="text" placeholder="Estado" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required/>
          <button className="button-form" onClick={() => { criarUser(); downloadCanvas(); }}>Baixar Canvas</button>
        </form>
      

        <ul>
          {users.map(user => {
            return (
              <div key={user.id}> 
                <li>{user.nome}</li>
                <li>{user.email}</li>
                <li>{user.telefone}</li>
                <li>{user.entidadegov}</li>
                <li>{user.cidade}</li>
                <li>{user.estado}</li>
                <button onClick={() => deleteUser(user.id)}>Deletar</button>
              </div>
            )
          })}
        </ul>
      </div>
    </div>
  )
};
