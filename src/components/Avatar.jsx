export default function Avatar({name = '',src,size = 'md', bgClass = 'bg-accent-blue-shadow',textClass='text-primary-3',}) 
{
  const types = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-xl',
  };
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <div className={`rounded-full flex items-center justify-center font-bold flex-shrink-0
      ${types[size]} ${bgClass} ${textClass}`}>
      {src ? (
        <img src={src} alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      ) : initial}
    </div>
  );
}
