"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Data", name, email, message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: JSON.stringify({
          access_key: "b769d072-0f54-4802-b57f-b1e129ba8225",
          name,
          email,
          message,
        }),
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
        },
      });
      if (res.status === 200) {
        // setSubmitted(true)
        console.log(res);
      }
    } catch (err: any) {
      console.error("Err", err);
    }
  };
  return (
    <section className="mx-auto mt-[40px]" id="consultation">
      <div className="flex items-center h-20 w-3/4  gap-10 mb-[60px]  ">
        <Link className="ml-[100px]" id="services" href="#">
          <h2 className="   text-[40px] leading-9 h-[51px] pt-1 px-2 bg-default-lime rounded-md ">
            Свяжитесь с нами
          </h2>
        </Link>
        <p className="">
          Оставьте нам сообщение: Давайте обсудим ваши потребности в маркетинге
        </p>
      </div>
      <div className="mx-auto w-[1240px]">
        <div className="from-box flex flex-row bg-default-grey justify-between content-evenly py-10 rounded-[45px] ">
          <form
            onSubmit={onSubmit}
            action="submit"
            className="flex flex-col w-[556px] justify-evenly ml-20 "
          >
            <div>
              <p className="mb-1 ml-1">Имя</p>
              <input
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[50px] rounded-xl px-8 "
                placeholder="Имя"
                type="text"
                value={name}
                name=""
                id=""
              />
            </div>
            <div>
              <p className="mb-1 ml-1">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className=" w-full h-[50px] rounded-xl px-8"
                placeholder="email"
                type="email"
                value={email}
                name=""
                id=""
              />
            </div>
            <div>
              <p className="mb-1 ml-1">Сообщение</p>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                className=" w-full h-[190px] rounded-xl px-8 py-2 resize-none "
                placeholder="Напишите нам"
                value={message}
                name=""
                id=""
                rows={6}
              />
            </div>
            <button
              type="submit"
              className=" bg-dark text-default-grey py-3 rounded-2xl hover:bg-default-lime hover:text-dark text-xl  transition duration-700  "
            >
              Отправить
            </button>
          </form>
          <Image
            src="/images/stars.svg"
            alt="Звездочки"
            width={691}
            height={648}
          />
        </div>
      </div>
    </section>
  );
}
