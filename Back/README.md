# Projeto_A3_Back - Como subir o projeto

Requisitos:
- IDE;
- Docker;
- Postman;

Passo a Passo:
1) No cmd, colocar o seguinte código: docker run -d -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management;
2) Verificar no package.json na parte de dependências, está: "amqplib": "0.10.3" para o funcionamento do barramento;
3) No terminal, é preciso dar um npm install, para instalar as dependências do projeto e depois um npm start para ele rodar;
4) Agora no Postman, vai colocar a rota desejada, por exemplo no caso de criar um lembrete: "POST: localhost:3000/lembretes";
5) No terminal da IDE, vai aparecer "publishing", singificando que a rota desejada foi colocada na fila do barramento, no seguinte endereço: localhost:15672;

