import './app.css';
import React, { useEffect, useState } from 'react';
import Header from './componentes/Header/header';
import Task from './componentes/Tasks/task.js';
import Footer from './componentes/Footer/footer.js';
import apiLembretes from './api/apiLembretes.js';
import apiObservacoes from './api/apiObservacoes.js';

function App() {
  const [days, setDays] = useState ([
    { id: 'sunday', dayName: 'Domingo' },
    { id: 'monday', dayName: 'Segunda' },
    { id: 'tuesday', dayName: 'Terça' },
    { id: 'wednesday', dayName: 'Quarta' },
    { id: 'thursday', dayName: 'Quinta' },
    { id: 'friday', dayName: 'Sexta' },
    { id: 'saturday', dayName: 'Sábado' }
  ]);

  const [task, setTask] = useState([]);

  useEffect(() => {
    const fetchTasksFromDatabase = async () => {
      try {
        const lembretes = await apiLembretes.get('/lembretes');  
        const observacoes = await apiObservacoes.get('/obs')

        const allDays = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

        let task = []

        allDays.forEach((day)=>{
          const findAllObj = lembretes.data.filter((obj)=> obj.dia_semana===day)
          const fullObj = findAllObj.map((obj)=> {

            const dataOriginal = new Date(obj.data_lembrete);
            // Obtém os componentes da data
            const ano = dataOriginal.getFullYear();
            const mes = ('0' + (dataOriginal.getMonth() + 1)).slice(-2); // Adiciona zero à esquerda para o mês
            const dia = ('0' + dataOriginal.getDate()).slice(-2); // Adiciona zero à esquerda para o dia
            // Formata a data no formato desejado (ano-mes-dia)
            const dataFormatada = `${ano}-${mes}-${dia}`;
  
            const findObs = observacoes.data.find((obs)=>obs.id_lembrete===obj.id_lembrete) 
  
            return ({ 
              date:dataFormatada, 
              description: findObs.texto || '',
              title: obj.nome_lembrete,
              category: obj.categoria,
              concluido: obj.concluido,
              id: obj.id_lembrete
            })
          })
          task.push(fullObj)
        })
        task=task.map((e, i)=>{
          const completeObj = [...e]
      
          return {dayName:allDays[i], data: [...e] }
        })
        setDays(task)

        setTask(lembretes.data);  
      } catch (error) {
        console.error('Erro ao buscar tarefas do banco de dados', error);
      }
    };

    fetchTasksFromDatabase();
  }, []);

  return (
    <div className='app'>
      <Header/>
      <main >
        <div className="days-container">
        {days.map((day) => (
            <Task key={day.dayName} dayDiv={day} tasks={task} setTasks={setTask} />
          ))}
        </div>
      </main>
      <Footer/>
    </div>
      
  );
}

export default App;
