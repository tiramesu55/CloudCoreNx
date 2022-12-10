import { fireEvent, render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import ConfigurationTabs, { IConfigurationPermissions } from './ConfigurationTabs'

/** Tests
 *  As a User I want to be able to navigate quickly between different setting panels or other content
 *  As a User I should be aware of which tab I am currently viewing
 *  As an Owner or Partner, I should only be able to view tabs that are in my permissions list  
 */

const allPermission: IConfigurationPermissions = {
    business: true,
    formulary: true,
    general: true,
    inventory: true,
    label: true
}
const onePermission: IConfigurationPermissions = {
    business: true,
    formulary: false,
    general: false,
    inventory: false,
    label: false
}


describe('Configuration Tabs', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<ConfigurationTabs permissions={allPermission} />);
        expect(baseElement).toBeTruthy();
    })

    it('As a User I want to be able to navigate quickly between different setting panels or other content', () => {
        render(<ConfigurationTabs permissions={allPermission} />);
        expect(screen.getByTestId("inventorySettingsTab")).toHaveAttribute(
            'aria-selected', "true"
        )
        fireEvent.click(screen.getByTestId('generalSettingsTab'))
        expect(screen.getByTestId("generalSettingsTab")).toHaveAttribute(
            'aria-selected', "true"
        )
        expect(screen.getByTestId("inventorySettingsTab")).toHaveAttribute(
            'aria-selected', "false"
        )
    })

    it("As a User I should be aware of which tab I am currently viewing", () => {
        render(<ConfigurationTabs permissions={allPermission} />);
        expect(screen.getByTestId("inventorySettingsTab")).toHaveAttribute(
            'aria-selected', "true"
        )
    })

    it("As an Owner or Partner, I should only be able to view tabs that are in my permissions list ", () => {
        render(<ConfigurationTabs permissions={onePermission} />);
        expect(screen.getByTestId("generalSettingsTab")).toBeDisabled()
        expect(screen.getByTestId("inventorySettingsTab")).toBeDisabled()
        expect(screen.getByTestId("labelSettingsTab")).toBeDisabled()
        expect(screen.getByTestId("formularyListTab")).toBeDisabled()
        expect(screen.getByTestId("businessRulesTab")).not.toBeDisabled()
    })
})