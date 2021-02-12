import React from 'react';
import classNames from 'classnames';

type BoardProps = {
  width: number;
  height: number;
  board: string;
};

export default function Board({ width, height, board }: BoardProps) {
  const tiles = board.split('').map((tile, index) => {
    const active = tile === '1';

    return (
      <div
        key={index}
        className={classNames('rounded-lg square', {
          'bg-green-800': !active,
          'bg-blue-800': active,
          'border-2 border-black': true,
        })}
      ></div>
    );
  });

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${width}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${height}, minMax(0, 1fr))`,
      }}
      className="grid max-w-lg"
    >
      {tiles}
    </div>
  );
}
