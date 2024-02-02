import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { isEmail, isMobilePhone } from "validator"
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
  const [ nome ] = useState("")
  const [ email ] = useState("")
  const [ telefone ] = useState("")
  const [ entidadegov ] = useState("")
  const [ estado ] = useState("")
  const [ cidade ] = useState("")

  // eslint-disable-next-line
  const [ users, setUsers ] = useState([])


  const db = getFirestore(firebaseApp)
  const userCollectionRef = collection(db, 'users')

/*START HOOK-FORM*/
  
  const { register, handleSubmit, formState: { errors } } = useForm() //Para identificar os inputs e validar
  const onSubmit = (data) => {
    console.log(data) 
    console.log({ errors })
  }

/*END HOOK-FORM*/
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
function validarCamposObrigatorios() {
  return (console.log("nada"))
}
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
    // alert('Preencha todos os campos obrigatórios antes de baixar o arquivo.'); 
  }
};
/*END DOWNLOAD FUNCTION*/

console.log("RENDER")

  return (
    <div className="container-form">
      <div className="bg-form">
       <img className="img-logo" src="/logo-licita-canvas-semfundo.png "alt="" />
          <h1 className="title-form">Preencha as informações a seguir e receba o Licita Canvas:</h1>        
          <p>{}</p>          
        <form action="" method="">
          <input 
          className={errors?.name && "input-error"}           
          type="text" 
          placeholder="Nome completo" 
          id="nome"           
          {...register('name', {required: true, minLength: 3 })} 
          />
          {errors?.name?.type === "required" && (
              <p className="error-message">Digite seu nome.</p>
          )} 
           {errors?.name?.type === "minLength" && (
              <p className="error-message">Por favor, digite o nome completo.</p>
          )} 

          <input 
          className={errors?.email && "input-error"}
          type="email" 
          placeholder="email@email.com" 
          id="email"           
          {...register('email', {required: true, validate: (value) => isEmail(value)})}
          />
          {errors?.email?.type === "required" && (
            <p className="error-message">Digite seu email.</p>
          )}
          {errors?.email?.type === "validate" && (
            <p className="error-message">Email inválido.</p>
          )}

          <input 
          className={errors?.telefone && "input-error"}
          type="text" 
          placeholder="67999668714" 
          id="telefone"          
          {...register('telefone', {required: true, 
            validate: (value) => isMobilePhone(String(value), 'pt-BR', { strictMode: false, min: 10, max: 13  })
            })} 
          />
          {errors?.telefone?.type === "required" && (
            <p className="error-message">Digite seu telefone.</p>
          )}
          {errors?.telefone?.type === "validate" && (
            <p className="error-message">Digite apenas números e sem espaços.</p>
          )}

          <input 
          /* className={errors?.name && "input-error"} */
          type="text" 
          placeholder="Órgão ou entidade governamental"           
          {...register('entidadegov')}
          /* {errors?.name?.type === "required" && (
            <p className="error-message">Name is required.</p>
          )} */
          />

          <select
          className={errors?.estado && "input-error"}
          type="text" 
          placeholder="Estado" 
          id="estado"           
          {...register('estado', { validate: (value) => {
            return value !== "0"
          }})}
          >
            <option value="0">Selecione o Estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
          
          {errors?.estado?.type === "validade" && (
            <p className="error-message">Selecione um estado estado.</p>
          )}
          {errors?.estado?.type === "0" && (
              <p className="error-message">Por favor, escolha o estado.</p>
          )}

          {/* <input    
          className={errors?.estado && "input-error"}
          type="text" 
          placeholder="Estado" 
          id="estado"           
          {...register('estado', {required: true, minLength: 2 })}
          />
          {errors?.estado?.type === "required" && (
            <p className="error-message">Digite o estado.</p>
          )}
          {errors?.estado?.type === "minLength" && (
              <p className="error-message">Por favor, digite o estado corretamente.</p>
          )} */}

          <input 
          className={errors?.cidade && "input-error"}
          type="text" 
          placeholder="Cidade" 
          id="cidade"           
          {...register('cidade', {required: true, minLength: 2 })}
          />
          {errors?.cidade?.type === "required" && (
            <p className="error-message">Digite a cidade.</p>
          )}
          {errors?.cidade?.type === "minLength" && (
              <p className="error-message">Por favor, digite a cidade corretamente.</p>
          )}
          <button className="button-form" onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); criarUser(); downloadCanvas(); }}>Baixar Canvas</button>
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
