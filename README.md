# 📋 Regras da Aplicação de Gerenciamento de Refeições  

Bem-vindo! Este é o guia completo das regras que regem o funcionamento da aplicação. 🥗🍎  

---

## 🎯 Funcionalidades  

### ✅ **Gerenciamento de Usuário**  
- **Criação de Usuário**: É possível criar um novo usuário.  
- **Identificação de Usuário**: Cada requisição deve identificar o usuário correspondente.  

### ✅ **Gerenciamento de Refeições**  
- **Registro de Refeições**: O usuário pode registrar uma refeição com as seguintes informações:  
  - Nome  
  - Descrição  
  - Data e Hora  
  - Está dentro ou não da dieta  
- **Edição de Refeições**: É possível editar todos os dados de uma refeição registrada.  
- **Exclusão de Refeições**: O usuário pode apagar uma refeição registrada.  
- **Listagem de Refeições**: É possível listar todas as refeições de um usuário.  
- **Visualização de Refeições**: O usuário pode visualizar os detalhes de uma única refeição registrada.  

### ✅ **Métricas do Usuário**  
- **Recuperação de Métricas**: A aplicação deve fornecer os seguintes dados:  
  - Quantidade total de refeições registradas.  
  - Quantidade total de refeições dentro da dieta.  
  - Quantidade total de refeições fora da dieta.  
  - Melhor sequência de refeições dentro da dieta.  

---

## 🚨 **Restrições**  
- Cada refeição deve estar relacionada a um usuário específico.  
- O usuário só pode visualizar, editar e apagar as refeições que ele criou.  
