import { Link } from 'react-router-dom';

function AddTechnology() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>➕ Добавить технологию</h1>
      <p>Функция в разработке</p>
      <Link to="/technologies">← Назад</Link>
    </div>
  );
}

export default AddTechnology;
