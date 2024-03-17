import { useEffect, useState } from "react";

export default function Card ({task,onSave,onDelete,index,preview}) {
    const [form, setForm] = useState({});
    useEffect(()=>{
        if(task){
            setForm({...task});
        }
    },[task])

    const handleChange = ({target:{name,value,checked}},index)=>{
        if (name==="concluido"){
            setForm({...form,[name]:checked})
        } else {
            setForm({...form,[name]:value})
        }
    }
    
    const getCategoryColor = (category) => {
        // Mapeie categorias para cores desejadas
        const categoryColors = {
          Trabalho: "#FFCCDA",
          Estudo: "#FFFCD3",
          Social: "#BCFFE6",
          Casa: "#CCF5FF",
          Saúde: "#E3BCFF",
        };
        return categoryColors[category] || "white";
    }

    const isDisabled = form.id && preview===false


    return (
        <div id={`task-${index}header`}>
            <div key={index} id={`task-${index}`} className="task-div">
            <input 
            type="text" 
            name="title"
            value={form.title}
            placeholder="Título" 
            className="title-input" 
            onChange={e => {
                handleChange(e, index)
            }}
            disabled={isDisabled}
            />
            
            <textarea 
            placeholder="Descrição" 
            className="description-input" 
            name="description"
            value={form.description}
            onChange={e => {
                handleChange(e, index)
            }}
            disabled={isDisabled}
            />

            <input 
            type="date" 
            className="date-input" 
            name="date"
            value={form.date}
            onChange={e => {
                handleChange(e, index)
            }}
            disabled={isDisabled}
            />

            <select
                className="category-select"
                name="category"
                value={form.category}
                onChange={(e) => handleChange(e, index)}
                disabled={isDisabled}
                style={{ backgroundColor: getCategoryColor(task.category) }}
            >
                <option value="Categoria" style={{ backgroundColor: "white" }}>
                Categoria
                </option>
                <option
                value="Trabalho"
                style={{ backgroundColor: getCategoryColor("Trabalho") }}
                >
                Trabalho
                </option>
                <option
                value="Estudo"
                style={{ backgroundColor: getCategoryColor("Estudo") }}
                >
                Estudo
                </option>
                <option
                value="Social"
                style={{ backgroundColor: getCategoryColor("Social") }}
                >
                Social
                </option>
                <option
                value="Casa"
                style={{ backgroundColor: getCategoryColor("Casa") }}
                >
                Casa
                </option>
                <option
                value="Saúde"
                style={{ backgroundColor: getCategoryColor("Saúde") }}
                >
                Saúde
                </option>
            </select>

            <div className="concluido">
                <p>Concluído:</p>
                <label className="switch">
                <input
                    type="checkbox"
                    name="concluido"
                    checked={form.concluido}
                    onChange={e => {
                    handleChange(e, index)
                    }}
                    disabled={isDisabled}
                />
                <span className="slider round"></span>
                </label>
            </div>

            <div className="btns">
                <button 
                className="save-btn" 
                onClick={()=>onSave(form,index)} 
                >
                {preview ? "Salvar" : "Editar"}
                </button>

                <button 
                onClick={() => {
                    if (preview) {
                        onDelete(index)
                    } else {
                        onDelete(form.id)
                    }
                }} 
                className="delete-button"
                >
                Apagar
                </button>
            </div>
            </div>
        </div>
    )
}

