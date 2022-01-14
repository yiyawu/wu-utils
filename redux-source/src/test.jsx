import React, { useImperativeHandle,useRef,forwardRef } from 'react'

    function FancyInput(props, ref) {
        const inputRef = useRef();
        useImperativeHandle(ref, () => ({
          focus: () => {
            inputRef.current.focus();
          }
        }));
        return <input ref={inputRef} />;
      }
      FancyInput = forwardRef(FancyInput);
