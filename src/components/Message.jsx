export default function Message({ role = 'user', content = '' }) {
  return (
    <div className={`message message--${role}`}>
      <p>{content}</p>
    </div>
  );
}
