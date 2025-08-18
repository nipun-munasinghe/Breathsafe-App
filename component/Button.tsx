'use client'
import React from 'react'

interface ButtonProps {
  onClick: () => void,
  name: string
}

const Button = ({ onClick, name }: ButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className="bg-lime-600 text-lg font-semibold w-full text-white pt-3 pb-3 rounded-md cursor-pointer mb-2 hover:bg-emerald-950 transform hover:scale-105 duration-300">
        {name}
      </button>
    </div>
  )
}

export default Button