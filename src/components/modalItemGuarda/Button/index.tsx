


interface IButton {
    chave: string,
    setAction: (chave: string | undefined) => void,
    children: React.ReactNode,
    action: string | undefined
}

export default function Button({ chave, setAction, children, action }: IButton) {
  return (
    <>
    <input type="checkbox" value={chave} checked={action === chave} className="hidden" onChange={(e) => setAction(e.target.value)}/>
    <button type="button" 
        onClick={() => {action === chave ? setAction(undefined) : setAction(`${chave}`)}}
        className={`text-gray-900  hover:bg-gray-100 border
            border-gray-200 font-medium rounded-lg
            text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600 
            dark:border-gray-700 dark:text-white  ${action === chave ? 'bg-indigo-900 hover:bg-light-blue-900': 'dark:bg-gray-800 dark:hover:bg-blue-900'}`}>
            {children}
    </button>
    </>
  )
}
