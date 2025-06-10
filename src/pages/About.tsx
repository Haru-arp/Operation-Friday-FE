import React from "react";

export default function About() {
    return (
        <div className="flex flex-col size-full justify-between ">
            <div className="flex flex-col gap-6 ">
                <div className="font-bold text-[24px]">미래 가젯 연구소 멤버</div>
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col">
                        <div className="font-bold text-[22px]">FE & Design</div>
                        <div className="font-bold text-[18px]">이동희</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-[22px]">BE</div>
                        <div className="font-bold text-[18px]">남환준</div>
                    </div>
                </div>
            </div>
            <div className="text-[10px]">계속해서 납치 예정...</div>
        </div>
    );
}
