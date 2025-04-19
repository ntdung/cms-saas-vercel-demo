'use client'
import { useState, useEffect } from "react";
import { resolveFlag, type AvailableFlags, type FlagData, type FlagState } from './useFlag.rsc'

/**
 * Client Side hook, to use a server action to fetch the Flag status. This 
 * requires the flag, or flags file to have the `'use server'` annotation that
 * will execute the logic on the server.
 * 
 * This allows the flags to use server side logic and will not send the flag
 * configuration to the browser
 * 
 * @param   flag            The flag function to use
 * @param   defaultState    The initial state to use for the flag
 * @returns The flag data, or default state if the flag has not yet loaded
 */
export function useFlag<FlagKey extends keyof AvailableFlags>(flag: FlagKey): FlagData<FlagKey> | undefined
export function useFlag<FlagKey extends keyof AvailableFlags>(flag: FlagKey, defaultState: FlagState<FlagKey>): FlagData<FlagKey>
export function useFlag<FlagKey extends keyof AvailableFlags>(flag: FlagKey, defaultState?: FlagState<FlagKey>): FlagData<FlagKey> | undefined {
    const [flagValue, setFlagValue] = useState<FlagData<FlagKey> | undefined>((defaultState ? { _enabled: false, ...defaultState } : undefined) as FlagData<FlagKey>)
    useEffect(() => {
        async function fetchFlagState() {
            const flagValue = await resolveFlag(flag)
            setFlagValue(flagValue)
        }
        fetchFlagState()
    }, [flag])
    return flagValue
}

export default useFlag