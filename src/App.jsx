import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { isEmail } from "validator"
import './App.css'


/*START CONNECTION DATABASE*/
const firebaseApp = initializeApp ({
  apiKey: "AIzaSyD-qTvTOhvdxojzgJ7lLH78c5lNNjqbXNg",
  authDomain: "licita-canvas-form.firebaseapp.com",
  projectId: "licita-canvas-form",
/*storageBucket: "licita-canvas-form.appspot.com",
  messagingSenderId: "144400210790",
  appId: "1:144400210790:web:660020c34570f82c5886a7",
  measurementId: "G-BTYT5DY215" */
});
/*END CONNECTION DATABASE*/

export const App = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const formRef = useRef();

  const [users] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, 'users');

  const onSubmit = async (data) => {
    // Form validation using react-hook-form
    if (Object.keys(errors).length === 0) {
      try {
        const user = await addDoc(userCollectionRef, {
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          entidadegov: data.entidadegov || '',
          estado: data.estado || '',
          cidade: data.cidade || '',
        });

        console.log('Usuário criado com sucesso:', user);
        alert('Enviado com sucesso!');        
        reset();
        downloadCanvas();
      } catch (error) {
        alert('Erro ao preencher o formullário, tente novamente.');
        console.error('Erro ao criar usuário:', error);
      }
    } else {
      console.log('Erro ao enviar formulário. Preencha corretamente todos os campos.');
    }
  };

/*START CREATE USER*/
const criarUser = async () => {
  try {
    const validationResult = await handleSubmit(onSubmit)(); // Dispara a validação e envio do formulário
    if (validationResult) {
      formRef.current.reset(); // Use a referência para chamar reset      
    }
  } catch (error) {
    console.error('Erro ao preencher o formulário, tente novamente.', error);
  }
};
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

/*START DOWNLOAD FUNCTION*/ 
  const downloadCanvas = () => {
  const arquivoCanvas = '/licita-canvas-download.png';

  // Cria um objeto Blob com a imagem
  fetch(arquivoCanvas)
    .then(response => response.blob())
    .then(blob => {
      // link temporário para o Blob
      const url = URL.createObjectURL(blob);

      // link <a> para o Blob e inicia o download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'licita-canvas-download.png';
      document.body.appendChild(link);
      link.click();

      // Libera recursos
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
};
/*END DOWNLOAD FUNCTION*/
console.log("RENDER")

  return (
    <div className="container-form">
      <div className="bg-form">
       <img className="img-logo" src="/logo-licita-canvas-semfundo.png "alt="" />
          <h1 className="title-form">Preencha as informações a seguir e receba o <br/> Licita Canvas:</h1> 
                           
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>

          <label className="label-form" htmlFor="nome">Nome completo:</label>
          <input 
          className={errors?.nome && "input-error"}           
          type="text" 
          placeholder="Digite seu nome completo" 
          id="nome"    
          name="nome"       
          {...register('nome', {required: true, minLength: 3 })} 
          />
          {errors?.nome?.type === "required" && (
              <p className="error-message">Digite seu nome completo.</p>
          )} 
           {errors?.nome?.type === "minLength" && (
              <p className="error-message">Por favor, digite o nome completo.</p>
          )} 

          <label className="label-form" htmlFor="email">Email:</label>
          <input 
          className={errors?.email && "input-error"}
          type="email" 
          placeholder="email@email.com" 
          id="email"      
          name="email"       
          {...register('email', {required: true, validate: (value) => isEmail(value)})}
          />
          {errors?.email?.type === "required" && (
            <p className="error-message">Digite seu email.</p>
          )}
          {errors?.email?.type === "validate" && (
            <p className="error-message">Email inválido.</p>
          )}

          <label className="label-form" htmlFor="telefone">Telefone:</label>
          <input           
          className={errors?.telefone && "input-error"}
          type="text" 
          placeholder="67999668714" 
          id="telefone"
          name="telefone"            
          {...register('telefone', {required: true, 
            validate: (value) => /^\d{10,13}$/.test(value)

            })} 
          />
          {errors?.telefone?.type === "required" && (
            <p className="error-message">Digite seu telefone.</p>
          )}
          {errors?.telefone?.type === "validate" && (
            <p className="error-message">Digite apenas números e sem espaços.</p>
          )}

          <label className="label-form" htmlFor="entidadegov">Órgão ou entidade governamental:</label>
          <input           
          type="text" 
          placeholder="Este campo não é obrigatório"           
          {...register('entidadegov')} 
          id="entidadegov"
          name="entidadegov"  
          />

          <label className="label-form" htmlFor="estado">Estado:</label>
          <select
          className={errors?.estado && "input-error"}
          type="text" 
          placeholder="Estado" 
          id="estado"  
          name="estado"     
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

          <label className="label-form" htmlFor="cidade">Cidade:</label>  
          <input          
          className={errors?.cidade && "input-error"}
          type="text" 
          placeholder="Digite qual a cidade da licitação" 
          id="cidade"           
          name="cidade"
          {...register('cidade', {required: true, minLength: 2 })}
          />
          {errors?.cidade?.type === "required" && (
            <p className="error-message">Digite a cidade.</p>
          )}
          {errors?.cidade?.type === "minLength" && (
              <p className="error-message">Por favor, digite a cidade corretamente.</p>
          )}
          <button className="button-form" onClick={(e) => { e.preventDefault(); criarUser(); }}>Baixar Canvas</button>
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
