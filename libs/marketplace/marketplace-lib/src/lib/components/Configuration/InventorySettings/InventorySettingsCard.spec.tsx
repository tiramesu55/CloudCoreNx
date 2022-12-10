import { fireEvent, render, screen } from "@testing-library/react"
import InventorySettingsCard from './InventorySettingsCard'
import MockInventorySettings from '../../../mocks/InventorySettings'
import '@testing-library/jest-dom'

/** Tests
 *  As a Partner I need a way to see if I am borrowing from the Owner
 *  As a Partner I expect borrowing to be turned off by default
 *  As a Partner I want a visual cue that borrowing has been turned on
 *  As a Partner, if borrowing is turned on, I want the percentage of my inventory I am borrowing to be visible. 
 *  As the Owner I want my Partner to realize they have view-only access to inventory settings but no ability to manipulate those settings  
 */

const filledMockData = MockInventorySettings.data[0]
const missingMockData = MockInventorySettings.data[2]

function RGBToHex(rgb: string): string {
    // Choose correct separator
    const sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    const rgbArray = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgbArray[0]).toString(16),
        g = (+rgbArray[1]).toString(16),
        b = (+rgbArray[2]).toString(16);

    if (r.length === 1)
        r = "0" + r;
    if (g.length === 1)
        g = "0" + g;
    if (b.length === 1)
        b = "0" + b;

    return "#" + r + g + b;
}

describe('Inventory Settings Card', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<InventorySettingsCard {...filledMockData} />);
        expect(baseElement).toBeTruthy();
    });

    it('should render name + initials successfully', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        expect(screen.getByText(filledMockData.initials).textContent).toBe(filledMockData.initials)
        expect(screen.getByText(filledMockData.name).textContent).toBe(filledMockData.name);
    })

    it('As a Partner I need a way to see if I am borrowing from the Owner', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        expect(screen.getByTestId(`${filledMockData.name}-borrowing-parent`)).toBeVisible()
    })

    it('As a Partner I expect borrowing to be turned off by default', () => {
        render(<InventorySettingsCard {...missingMockData} />);
        expect(screen.getByTestId(`${missingMockData.name}-borrowing`)).not.toBeChecked()
    })

    it('As a Partner I want a visual cue that borrowing has been turned on', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        expect(screen.getByTestId(`${filledMockData.name}-borrowing`)).toBeChecked()
    })

    it('As a Partner, if borrowing is turned on, I want the percentage of my inventory I am borrowing to be visible.', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        expect(screen.getByTestId(`${filledMockData.name}-borrowing`)).toBeChecked()
        expect(screen.getByTestId(`${filledMockData.name}-percentage`)).toBeVisible()
    })

    it('As a Owner, if I change a Inventory Setting I should be prompted to save changes', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        const borrowingSpan = screen.getByTestId(`${filledMockData.name}-borrowing`)
        fireEvent.click(borrowingSpan)
        expect(screen.getByTestId(`${filledMockData.name}-borrowing`)).not.toBeChecked()
        const submitBtn = screen.getByTestId(`${filledMockData.name}-submit`)
        expect(submitBtn).toBeVisible()
    })

    it('As the Owner I want my Partner to realize they have view-only access to inventory settings but no ability to manipulate those settings', () => {
        render(<InventorySettingsCard {...missingMockData} />);
        const borrowingSwitch = screen.getByTestId(`${missingMockData.name}-borrowing`)
        expect(borrowingSwitch).toBeDisabled()
    })

    it('As a Partner I expect my companys color to be the avatar color is supplied', () => {
        render(<InventorySettingsCard {...filledMockData} />);
        const avatar = screen.getByTestId(`${filledMockData.name}-avatar`)
        if (filledMockData.color) {
            expect(RGBToHex(window.getComputedStyle(avatar).backgroundColor)).toMatch(filledMockData.color.toString())

        } else {
            throw new Error("No Color Provided For Test Data")
        }
    })
});
