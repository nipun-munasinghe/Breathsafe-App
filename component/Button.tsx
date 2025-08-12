import React from 'react'

interface ButtonProps {
  onClick: () => void,
  name: string
}

const Button = ({ onClick, name }: ButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className="bg-lime-600 text-lg font-semibold text-white w-96 pt-3 pb-3 rounded-md cursor-pointer mb-2 hover:bg-emerald-950 transition-colors duration-200">
        {name}
      </button>
    </div>
  )
}

export default Button